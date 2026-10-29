import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import GroupKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score, classification_report

dataset_path = r'D:\Downloads\ApnaSa_All_Inputs_Diverse_Complete_90_Days\apnasa_1000_users_90_days_all_inputs_diverse_complete.csv'

print("Loading dataset...")
cols_to_use = [
    'senior_id', 'age', 'sex', 'weight_kg', 'sleep_hours',
    'bp_systolic_mmhg', 'bp_diastolic_mmhg', 'heart_rate_bpm', 'spo2_percent',
    'blood_glucose_mg_dl', 'pain_level_0_to_10', 'pain_mentioned',
    'missed_doses_reported', 'medication_count',
    'eating_independent', 'toileting_independent', 'moving_independent', 'walking_independent',
    'able_to_walk_independently', 'adl_score_synthetic_0_to_6',
    'diabetes_reported', 'hypertension_reported', 'osteoarthritis_reported',
    'hearing_difficulty_reported', 'hearing_aid_used_reported',
    'decline_within_7d'
]

df = pd.read_csv(dataset_path, usecols=cols_to_use)
print(f"Loaded {len(df)} rows. Memory usage: {df.memory_usage().sum() / 1e6:.1f} MB")

# Preprocessing
df['is_female'] = (df['sex'] == 'Female').astype(int)

feature_cols = [
    'age', 'is_female', 'weight_kg', 'sleep_hours',
    'bp_systolic_mmhg', 'bp_diastolic_mmhg', 'heart_rate_bpm', 'spo2_percent',
    'blood_glucose_mg_dl', 'pain_level_0_to_10', 'pain_mentioned',
    'missed_doses_reported', 'medication_count',
    'eating_independent', 'toileting_independent', 'moving_independent', 'walking_independent',
    'able_to_walk_independently', 'adl_score_synthetic_0_to_6',
    'diabetes_reported', 'hypertension_reported', 'osteoarthritis_reported',
    'hearing_difficulty_reported', 'hearing_aid_used_reported'
]

X = df[feature_cols].copy()
y = df['decline_within_7d'].values
groups = df['senior_id'].values

print("Feature matrix shape:", X.shape)
print("Decline cases:", y.sum(), f"({y.mean()*100:.2f}%)")

# Group split by senior_id
unique_seniors = np.unique(groups)
np.random.seed(42)
np.random.shuffle(unique_seniors)

train_seniors = set(unique_seniors[:800])
test_seniors = set(unique_seniors[800:])

train_mask = df['senior_id'].isin(train_seniors)
test_mask = df['senior_id'].isin(test_seniors)

X_train, y_train = X[train_mask], y[train_mask]
X_test, y_test = X[test_mask], y[test_mask]

print(f"Train set: {len(X_train)} samples ({y_train.sum()} positive)")
print(f"Test set: {len(X_test)} samples ({y_test.sum()} positive)")

# Train Random Forest with class weighting
clf = RandomForestClassifier(
    n_estimators=100,
    max_depth=12,
    min_samples_split=20,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)

clf.fit(X_train, y_train)
preds_proba = clf.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, preds_proba)
print(f"ROC-AUC on test set (200 unseen seniors): {auc:.4f}")

# Feature importances
importances = pd.Series(clf.feature_importances_, index=feature_cols).sort_values(ascending=False)
print("\nTop 10 Feature Importances:")
print(importances.head(10))

# Save model and artifacts
output_dir = r'D:\OneDrive\Desktop\Deviathon\Deviathon\ml_model'
os.makedirs(output_dir, exist_ok=True)
joblib.dump(clf, os.path.join(output_dir, 'elder_risk_rf_model.pkl'))
joblib.dump(feature_cols, os.path.join(output_dir, 'feature_cols.pkl'))
print(f"\nModel and features saved successfully to {output_dir}")

