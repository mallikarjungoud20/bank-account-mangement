package com.bank.bank_backend.service;

import com.bank.bank_backend.model.Transaction;
import com.bank.bank_backend.model.User;
import com.bank.bank_backend.model.Summary;
import com.bank.bank_backend.repository.TransactionRepository;
import com.bank.bank_backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SmsService smsService;  // 📱 SMS SERVICE INJECTION

    // 🔹 GET CURRENT USER (SAFE)
    private User getUser() {

        List<User> users = userRepo.findAll();

        if (users == null || users.isEmpty()) {
            throw new RuntimeException("No users in database ❌");
        }

        User user = users.get(0);

        if (user.getBalance() == null) {
            user.setBalance(0.0);
            userRepo.save(user);
        }

        return user;
    }

    // 🔹 CURRENT TIME
    private String now() {
        return LocalDateTime.now().toString();
    }

    // 🔹 CREATE TRANSACTION (COMMON METHOD)
    private Transaction createTransaction(User user, String type, double amount, String receiver, String status) {

        Transaction t = new Transaction();
        t.setPhone(user.getPhone());   // 🔥 IMPORTANT FIX
        t.setType(type);
        t.setAmount(amount);
        t.setDate(now());
        t.setReceiver(receiver);
        t.setStatus(status);

        return transactionRepo.save(t);
    }

    // 🔹 DEPOSIT
    public Transaction deposit(double amount) {

        User user = getUser();

        if (user.isFrozen()) {
            return createTransaction(user, "Deposit", amount, "-", "FAILED");
        }

        user.setBalance(user.getBalance() + amount);
        userRepo.save(user);

        Transaction transaction = createTransaction(user, "Deposit", amount, "-", "SUCCESS");
        
        // 📱 SEND SMS NOTIFICATION
        smsService.sendDepositNotification(user.getPhone(), amount, user.getBalance());
        
        return transaction;
    }

    // 🔹 WITHDRAW
    public Transaction withdraw(double amount) {

        User user = getUser();

        if (user.isFrozen()) {
            return createTransaction(user, "Withdraw", amount, "-", "FAILED");
        }

        if (user.getBalance() < amount) {
            return createTransaction(user, "Withdraw", amount, "-", "FAILED");
        }

        user.setBalance(user.getBalance() - amount);
        userRepo.save(user);

        Transaction transaction = createTransaction(user, "Withdraw", amount, "-", "SUCCESS");
        
        // 📱 SEND SMS NOTIFICATION
        smsService.sendWithdrawNotification(user.getPhone(), amount, user.getBalance());
        
        return transaction;
    }

    // 🔹 TRANSFER
    public Transaction transfer(double amount, String receiver) {

        User user = getUser();

        if (user.isFrozen()) {
            return createTransaction(user, "Transfer", amount, receiver, "FAILED");
        }

        if (user.getBalance() < amount) {
            return createTransaction(user, "Transfer", amount, receiver, "FAILED");
        }

        Transaction txn = createTransaction(user, "Transfer", amount, receiver, "PENDING");

        user.setBalance(user.getBalance() - amount);
        userRepo.save(user);

        txn.setStatus("SUCCESS");
        Transaction transaction = transactionRepo.save(txn);
        
        // 📱 SEND SMS NOTIFICATION
        smsService.sendTransferNotification(user.getPhone(), amount, receiver);
        
        return transaction;
    }

    // 🔹 GET ALL TRANSACTIONS
    public List<Transaction> getAll() {
        return transactionRepo.findAll();
    }

    // 🔹 GET BALANCE
    public Double getBalance() {

        User user = getUser();

        if (user == null) return 0.0;

        return user.getBalance() != null ? user.getBalance() : 0.0;
    }

    // 🔹 GET SUMMARY (USER-SPECIFIC FIX)
    public Summary getSummary() {

        User user = getUser();

        List<Transaction> transactions = transactionRepo.findByPhone(user.getPhone());

        double totalDeposit = 0;
        double totalWithdraw = 0;
        int totalTransactions = 0;

        for (Transaction t : transactions) {

            if (t.getType().equalsIgnoreCase("Deposit") && t.getStatus().equalsIgnoreCase("SUCCESS")) {
                totalDeposit += t.getAmount();
            }

            else if (t.getType().equalsIgnoreCase("Withdraw") && t.getStatus().equalsIgnoreCase("SUCCESS")) {
                totalWithdraw += t.getAmount();
            }

            totalTransactions++;
        }

        return new Summary(totalDeposit, totalWithdraw, totalTransactions);
    }
}