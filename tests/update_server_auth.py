def update_server(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    target = '''@app.route("/api/auth/otp/send", methods=["POST"])
def auth_send_otp():
    data = request.json or {}
    recipient = data.get("recipient", "")
    # Generated mock OTP
    return jsonify({
        "success": True,
        "otp": "4826",
        "recipient": recipient,
        "message": "Demo OTP dispatched successfully"
    })'''

    addition = '''@app.route("/api/auth/otp/send", methods=["POST"])
def auth_send_otp():
    data = request.json or {}
    recipient = data.get("recipient", "")
    # Generated mock OTP
    return jsonify({
        "success": True,
        "otp": "4826",
        "recipient": recipient,
        "message": "Demo OTP dispatched successfully"
    })

@app.route("/api/auth/otp/verify", methods=["POST"])
def auth_verify_otp():
    data = request.json or {}
    otp = str(data.get("otp", "")).strip()
    return jsonify({
        "success": True,
        "verified": True,
        "message": "OTP verified successfully"
    })

@app.route("/api/auth/password/reset", methods=["POST"])
def auth_password_reset():
    data = request.json or {}
    return jsonify({
        "success": True,
        "message": "Password reset successfully. You may now log in with your new password."
    })'''

    if target in content:
        content = content.replace(target, addition)
    elif target.replace('\n', '\r\n') in content:
        content = content.replace(target.replace('\n', '\r\n'), addition.replace('\n', '\r\n'))
    else:
        print(f"Target not found in {filepath}")
        return

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

update_server('server.py')
import os
if os.path.exists('Deviathon/server.py'):
    update_server('Deviathon/server.py')

