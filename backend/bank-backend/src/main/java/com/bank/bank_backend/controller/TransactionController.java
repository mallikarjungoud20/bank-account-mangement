package com.bank.bank_backend.controller;

import com.bank.bank_backend.dto.TransactionRequest;
import com.bank.bank_backend.dto.TransferRequest;
import com.bank.bank_backend.model.Transaction;
import com.bank.bank_backend.model.User;
import com.bank.bank_backend.repository.TransactionRepository;
import com.bank.bank_backend.repository.UserRepository;
import com.bank.bank_backend.service.SmsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SmsService smsService;

    // ✅ DEPOSIT
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody TransactionRequest request) {

        User user = userRepository.findByPhone(request.getPhone());

        if (user == null) {
            return ResponseEntity.status(404).body("User not found ❌");
        }

        user.setBalance(user.getBalance() + request.getAmount());
        userRepository.save(user);

        Transaction t = new Transaction();
        t.setPhone(user.getPhone());
        t.setType("Deposit");
        t.setAmount(request.getAmount());
        t.setReceiver("SELF");
        t.setStatus("SUCCESS");
        t.setDate(java.time.LocalDateTime.now().toString());

        transactionRepository.save(t);

        // 📱 SEND SMS NOTIFICATION
        try {
            smsService.sendDepositNotification(user.getPhone(), request.getAmount(), user.getBalance());
        } catch (Exception e) {
            System.out.println("SMS failed: " + e.getMessage());
        }

        return ResponseEntity.ok(user);
    }

    // ✅ WITHDRAW
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody TransactionRequest request) {

        User user = userRepository.findByPhone(request.getPhone());

        if (user == null) {
            return ResponseEntity.status(404).body("User not found ❌");
        }

        if (user.getBalance() < request.getAmount()) {
            return ResponseEntity.status(400).body("Insufficient balance ❌");
        }

        user.setBalance(user.getBalance() - request.getAmount());
        userRepository.save(user);

        Transaction t = new Transaction();
        t.setPhone(user.getPhone());
        t.setType("Withdraw");
        t.setAmount(request.getAmount());
        t.setReceiver("SELF");
        t.setStatus("SUCCESS");
        t.setDate(java.time.LocalDateTime.now().toString());

        transactionRepository.save(t);

        // 📱 SEND SMS NOTIFICATION
        try {
            smsService.sendWithdrawNotification(user.getPhone(), request.getAmount(), user.getBalance());
        } catch (Exception e) {
            System.out.println("SMS failed: " + e.getMessage());
        }

        return ResponseEntity.ok(user);
    }

    // ✅ TRANSFER
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {

        User sender = userRepository.findByPhone(request.getFromPhone());
        User receiver = userRepository.findByPhone(request.getToPhone());

        if (sender == null || receiver == null) {
            return ResponseEntity.status(404).body("User not found ❌");
        }

        if (sender.getBalance() < request.getAmount()) {
            return ResponseEntity.status(400).body("Insufficient balance ❌");
        }

        sender.setBalance(sender.getBalance() - request.getAmount());
        receiver.setBalance(receiver.getBalance() + request.getAmount());

        userRepository.save(sender);
        userRepository.save(receiver);

        // sender transaction
        Transaction t1 = new Transaction();
        t1.setPhone(sender.getPhone());
        t1.setType("Transfer");
        t1.setAmount(request.getAmount());
        t1.setReceiver(request.getToPhone());
        t1.setStatus("SUCCESS");
        t1.setDate(java.time.LocalDateTime.now().toString());

        transactionRepository.save(t1);

        // receiver transaction
        Transaction t2 = new Transaction();
        t2.setPhone(receiver.getPhone());
        t2.setType("Received");
        t2.setAmount(request.getAmount());
        t2.setReceiver(request.getFromPhone());
        t2.setStatus("SUCCESS");
        t2.setDate(java.time.LocalDateTime.now().toString());

        transactionRepository.save(t2);

        // 📱 SEND SMS TO SENDER
        try {
            smsService.sendTransferNotification(sender.getPhone(), request.getAmount(), request.getToPhone());
        } catch (Exception e) {
            System.out.println("SMS to sender failed: " + e.getMessage());
        }

        // 📱 SEND SMS TO RECEIVER
        try {
            String receiverMessage = "My Bank:\n₹" + request.getAmount() + " received successfully.\nBalance: ₹" + receiver.getBalance();
            smsService.sendSMS(receiver.getPhone(), receiverMessage);
        } catch (Exception e) {
            System.out.println("SMS to receiver failed: " + e.getMessage());
        }

        return ResponseEntity.ok("Transfer Successful ✅");
    }

    // 🔥 SUMMARY
    @GetMapping("/summary/{phone}")
    public Map<String, Double> getSummary(@PathVariable String phone) {

        List<Transaction> list = transactionRepository.findByPhone(phone);

        double deposit = 0;
        double withdraw = 0;

        for (Transaction t : list) {
            if (t.getType().equals("Deposit")) {
                deposit += t.getAmount();
            } else if (t.getType().equals("Withdraw")) {
                withdraw += t.getAmount();
            }
        }

        Map<String, Double> data = new HashMap<>();
        data.put("totalDeposit", deposit);
        data.put("totalWithdraw", withdraw);
        data.put("totalTransactions", (double) list.size());

        return data;
    }

    // 🔥 BALANCE
    @GetMapping("/balance/{phone}")
    public Double getBalance(@PathVariable String phone) {
        User user = userRepository.findByPhone(phone);
        return user.getBalance();
    }

    // 🔥 TRANSACTIONS
    @GetMapping("/transactions/{phone}")
    public List<Transaction> getTransactions(@PathVariable String phone) {
        return transactionRepository.findByPhone(phone);
    }
}