package com.bank.bank_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String accountNumber;

    private String name;

    @Column(unique = true)
    private String phone;

    private String email;

    private String password;

    private String pin;

    private Double balance;

    private boolean frozen;

    // ✅ DEFAULT CONSTRUCTOR (VERY IMPORTANT)
    public User() {}

    // ✅ GETTERS & SETTERS (MANDATORY)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public boolean isFrozen() { return frozen; }
    public void setFrozen(boolean frozen) { this.frozen = frozen; }

    // ✅ PIN GETTER & SETTER (REQUIRED)
public String getPin() {
    return pin;
}

public void setPin(String pin) {
    this.pin = pin;
}
}