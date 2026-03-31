package com.bank.bank_backend.controller;

import com.bank.bank_backend.model.Transaction;
import com.bank.bank_backend.model.User;
import com.bank.bank_backend.repository.TransactionRepository;
import com.bank.bank_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    // 🔹 GET ALL USERS
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    // 🔹 GET ALL TRANSACTIONS
    @GetMapping("/transactions")
    public List<Transaction> getTransactions() {
        return transactionRepo.findAll();
    }

    // 🔥 FREEZE USER
    @PutMapping("/freeze/{id}")
    public String freezeUser(@PathVariable Long id) {
        User user = userRepo.findById(id).orElse(null);
        user.setFrozen(true);
        userRepo.save(user);
        return "User Frozen ❄️";
    }

    // 🔥 UNFREEZE USER
    @PutMapping("/unfreeze/{id}")
    public String unfreezeUser(@PathVariable Long id) {
        User user = userRepo.findById(id).orElse(null);
        user.setFrozen(false);
        userRepo.save(user);
        return "User Active ✅";
    }

    // 🔥 FIX FAILED TRANSACTION
    @PutMapping("/fix/{id}")
    public String fixTransaction(@PathVariable Long id) {
        Transaction t = transactionRepo.findById(id).orElse(null);

        if (t.getStatus().equals("FAILED")) {
            t.setStatus("SUCCESS");
            transactionRepo.save(t);
            return "Transaction Fixed ✅";
        }

        return "Not a failed transaction";
    }

    // 🔥 COMPLETE PENDING TRANSACTION
    @PutMapping("/complete/{id}")
    public String completeTransaction(@PathVariable Long id) {
        Transaction t = transactionRepo.findById(id).orElse(null);

        if (t.getStatus().equals("PENDING")) {
            t.setStatus("SUCCESS");
            transactionRepo.save(t);
            return "Transaction Completed ✅";
        }

        return "Not a pending transaction";
    }
}