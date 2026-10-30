# -*- coding: utf-8 -*-
"""
CareConnect - Machine Learning Risk Assessment Model Trainer
Trained on ElderHealth Multi-Parameter Assessment Dataset (elderhealth_assessment_dataset_corrected_updated.csv)
Trains both Random Forest and Logistic Regression Classifiers (+ Soft Ensemble)
Predicts Health Risk Category: Low, Moderate, High
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier, VotingClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, f1_score, precision_score, recall_score, r2_score

def train_models():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, 'data', 'elderhealth_assessment_dataset_corrected_updated.csv')
    
    if not os.path.exists(dataset_path):
        # Fallback to desktop path if running standalone
        dataset_path = r'D:\OneDrive\Desktop\elderhealth_assessment_dataset_corrected_updated.csv'
    
    print(f"[ML Trainer] Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    print(f"[ML Trainer] Loaded {len(df)} records with {len(df.columns)} columns.")

    # 1. Feature Engineering & Preparation
    df_clean = df.copy()
    df_clean['is_female'] = (df_clean['gender'].astype(str).str.upper().str.startswith('F')).astype(int)

    feature_cols = [
        'age', 'is_female', 'weight_kg', 'height_cm', 'BMI',
        'eating', 'toileting', 'moving', 'walking', 'num_dependent_activities', 'adl_score', 'dependency_status',
        'hearing_impairment', 'pain_present', 'pain_level',
        'diabetes', 'hypertension', 'heart_disease', 'arthritis', 'respiratory_disease', 'num_comorbidities',
        'medication_count', 'polypharmacy_flag'
    ]

    X = df_clean[feature_cols].copy()
    y_cat = df_clean['health_risk_category'].copy()
    y_score = df_clean['health_score'].copy()

    classes = sorted(list(y_cat.unique()))  # ['High', 'Low', 'Moderate']
    print(f"[ML Trainer] Target classes: {classes}")
    print(f"[ML Trainer] Class distribution:\n{y_cat.value_counts()}")

    # 2. Stratified Train / Test Split
    X_train, X_test, y_train, y_test, y_train_score, y_test_score = train_test_split(
        X, y_cat, y_score, test_size=0.20, random_state=42, stratify=y_cat
    )

    print(f"[ML Trainer] Train set size: {len(X_train)}, Test set size: {len(X_test)}")

    # 3. Model 1: Random Forest Classifier
    print("\n--- Training Random Forest Classifier ---")
    rf_clf = RandomForestClassifier(
        n_estimators=160,
        max_depth=9,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    rf_clf.fit(X_train, y_train)
    rf_preds = rf_clf.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    rf_f1 = f1_score(y_test, rf_preds, average='macro')
    print(f"Random Forest Test Accuracy: {rf_acc:.4f}, Macro F1: {rf_f1:.4f}")

    # 4. Model 2: Logistic Regression Classifier with StandardScaler
    print("\n--- Training Logistic Regression Classifier ---")
    lr_pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('lr', LogisticRegression(
            C=1.2,
            max_iter=1000,
            class_weight='balanced',
            random_state=42
        ))
    ])
    lr_pipe.fit(X_train, y_train)
    lr_preds = lr_pipe.predict(X_test)
    lr_acc = accuracy_score(y_test, lr_preds)
    lr_f1 = f1_score(y_test, lr_preds, average='macro')
    print(f"Logistic Regression Test Accuracy: {lr_acc:.4f}, Macro F1: {lr_f1:.4f}")

    # 5. Model 3: Soft-Voting Ensemble (Random Forest + Logistic Regression)
    print("\n--- Training Soft-Voting Ensemble (RF + LR) ---")
    ensemble_clf = VotingClassifier(
        estimators=[
            ('rf', rf_clf),
            ('lr', lr_pipe)
        ],
        voting='soft',
        weights=[1.0, 1.2]
    )
    ensemble_clf.fit(X_train, y_train)
    ens_preds = ensemble_clf.predict(X_test)
    ens_acc = accuracy_score(y_test, ens_preds)
    ens_f1 = f1_score(y_test, ens_preds, average='macro')
    print(f"Ensemble Test Accuracy: {ens_acc:.4f}, Macro F1: {ens_f1:.4f}")

    # 6. Model 4: Continuous Health Score Regressor
    print("\n--- Training Health Score Regressor ---")
    score_reg = RandomForestRegressor(
        n_estimators=100,
        max_depth=8,
        random_state=42,
        n_jobs=-1
    )
    score_reg.fit(X_train, y_train_score)
    score_preds = score_reg.predict(X_test)
    score_r2 = r2_score(y_test_score, score_preds)
    print(f"Health Score Regressor R2 Score: {score_r2:.4f}")

    # 7. Cross-Validation Benchmark
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    rf_cv = cross_val_score(rf_clf, X, y_cat, cv=cv, scoring='accuracy').mean()
    lr_cv = cross_val_score(lr_pipe, X, y_cat, cv=cv, scoring='accuracy').mean()
    ens_cv = cross_val_score(ensemble_clf, X, y_cat, cv=cv, scoring='accuracy').mean()

    print("\n=== 5-Fold Cross Validation Summary ===")
    print(f"Random Forest CV Accuracy:     {rf_cv*100:.2f}%")
    print(f"Logistic Regression CV Accuracy: {lr_cv*100:.2f}%")
    print(f"Ensemble Model CV Accuracy:    {ens_cv*100:.2f}%")

    # Feature importances from Random Forest
    rf_feat_imp = pd.Series(rf_clf.feature_importances_, index=feature_cols).sort_values(ascending=False).to_dict()

    # Classification Reports
    report = {
        "dataset_name": "elderhealth_assessment_dataset_corrected_updated.csv",
        "total_records": len(df),
        "feature_count": len(feature_cols),
        "target_classes": classes,
        "models": {
            "random_forest": {
                "test_accuracy": round(rf_acc, 4),
                "macro_f1": round(rf_f1, 4),
                "cv_accuracy_5fold": round(rf_cv, 4),
                "classification_report": classification_report(y_test, rf_preds, output_dict=True)
            },
            "logistic_regression": {
                "test_accuracy": round(lr_acc, 4),
                "macro_f1": round(lr_f1, 4),
                "cv_accuracy_5fold": round(lr_cv, 4),
                "classification_report": classification_report(y_test, lr_preds, output_dict=True)
            },
            "ensemble": {
                "test_accuracy": round(ens_acc, 4),
                "macro_f1": round(ens_f1, 4),
                "cv_accuracy_5fold": round(ens_cv, 4),
                "classification_report": classification_report(y_test, ens_preds, output_dict=True)
            },
            "health_score_regressor": {
                "test_r2": round(score_r2, 4)
            }
        },
        "top_feature_importances": rf_feat_imp
    }

    # 8. Save Model Artifacts
    output_dirs = [
        os.path.join(base_dir, 'ml_model'),
        os.path.join(base_dir, 'Deviathon', 'ml_model')
    ]

    for out_dir in output_dirs:
        os.makedirs(out_dir, exist_ok=True)
        joblib.dump(rf_clf, os.path.join(out_dir, 'elder_risk_rf_model.pkl'))
        joblib.dump(lr_pipe, os.path.join(out_dir, 'elder_risk_lr_model.pkl'))
        joblib.dump(ensemble_clf, os.path.join(out_dir, 'elder_risk_ensemble_model.pkl'))
        joblib.dump(score_reg, os.path.join(out_dir, 'elder_health_score_model.pkl'))
        joblib.dump(feature_cols, os.path.join(out_dir, 'feature_cols.pkl'))
        joblib.dump(classes, os.path.join(out_dir, 'label_classes.pkl'))
        
        with open(os.path.join(out_dir, 'model_performance_report.json'), 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)

    print(f"\n[ML Trainer] Successfully saved all model artifacts to:")
    for out_dir in output_dirs:
        print(f"  -> {out_dir}")

    return report

if __name__ == '__main__':
    train_models()
