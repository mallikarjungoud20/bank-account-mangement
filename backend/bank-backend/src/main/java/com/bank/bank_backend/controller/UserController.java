package com.bank.bank_backend.controller;

import com.bank.bank_backend.model.User;
import com.bank.bank_backend.repository.UserRepository;
import com.bank.bank_backend.service.SmsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SmsService smsService;  // 📱 SMS SERVICE INJECTION

    // 🔹 GET USER BY ID (FOR PROFILE)
@GetMapping("/users/{id}")
public ResponseEntity<?> getUserById(@PathVariable Long id) {

    User user = userRepository.findById(id).orElse(null);

    if (user == null) {
        return ResponseEntity.status(404).body("User not found ❌");
    }

    return ResponseEntity.ok(user);
}
    // 🔹 REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {
            user.setAccountNumber("ACC" + System.currentTimeMillis());
            user.setFrozen(false);

            if (user.getBalance() == null) {
                user.setBalance(0.0);
            }

            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Registration failed ❌");
        }
    }
    @PutMapping("/users/{id}")
public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {

    User user = userRepository.findById(id).orElse(null);

    if (user != null) {
        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setEmail(updatedUser.getEmail());

        return userRepository.save(user);
    }

    return null;
}
@PutMapping("/users/{id}/password")
public String changePassword(@PathVariable Long id, @RequestBody User request) {

    User user = userRepository.findById(id).orElse(null);

    if (user != null) {
        user.setPassword(request.getPassword());
        userRepository.save(user);
        
        // 📱 SEND SMS NOTIFICATION
        try {
            smsService.sendPasswordChangeNotification(user.getPhone());
        } catch (Exception e) {
            System.out.println("SMS failed: " + e.getMessage());
        }
        
        return "Password updated";
    }

    return "User not found";
}


    // 🔹 LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {

        if (loginRequest.getPhone() == null || loginRequest.getPhone().isEmpty()) {
            return ResponseEntity.badRequest().body("Phone number is missing ❌");
        }

        User user = userRepository.findByPhone(loginRequest.getPhone());

        if (user == null) {
            return ResponseEntity.status(404).body("User not found ❌");
        }

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).body("Incorrect password ❌");
        }

        return ResponseEntity.ok(user);
    }

    // 🔹 VERIFY PIN
    @PostMapping("/verify-pin")
    public ResponseEntity<?> verifyPin(@RequestBody User request) {

        User user = userRepository.findByPhone(request.getPhone());

        if (user == null) {
            return ResponseEntity.status(404).body("User not found ❌");
        }

        if (!user.getPin().equals(request.getPin())) {
            return ResponseEntity.status(401).body("Incorrect PIN ❌");
        }

        return ResponseEntity.ok("PIN verified ✅");
    }
}