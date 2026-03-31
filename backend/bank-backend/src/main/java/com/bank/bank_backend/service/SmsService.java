package com.bank.bank_backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account_sid}")
    private String ACCOUNT_SID;

    @Value("${twilio.auth_token}")
    private String AUTH_TOKEN;

    @Value("${twilio.phone_number}")
    private String FROM_NUMBER;

    // 📱 CORE SMS METHOD
    public void sendSMS(String to, String messageText) {

        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        Message.creator(
                new com.twilio.type.PhoneNumber("+91" + to),
                new com.twilio.type.PhoneNumber(FROM_NUMBER),
                messageText
        ).create();
    }

    // 💰 DEPOSIT NOTIFICATION
    public void sendDepositNotification(String phone, double amount, Double balance) {
        String message = "My Bank:\n₹" + amount + " deposited successfully.\nBalance: ₹" + balance;
        sendSMS(phone, message);
    }

    // 💸 WITHDRAW NOTIFICATION
    public void sendWithdrawNotification(String phone, double amount, Double balance) {
        String message = "My Bank:\n₹" + amount + " withdrawn successfully.\nBalance: ₹" + balance;
        sendSMS(phone, message);
    }

    // 🔄 TRANSFER NOTIFICATION
    public void sendTransferNotification(String phone, double amount, String toPhone) {
        String message = "My Bank:\n₹" + amount + " transferred successfully to " + toPhone;
        sendSMS(phone, message);
    }

    // 🔐 PASSWORD CHANGE NOTIFICATION
    public void sendPasswordChangeNotification(String phone) {
        String message = "My Bank:\nYour password has been updated successfully.";
        sendSMS(phone, message);
    }
}