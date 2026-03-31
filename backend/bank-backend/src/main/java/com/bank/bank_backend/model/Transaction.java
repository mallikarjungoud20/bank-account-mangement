package com.bank.bank_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")

public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phone;   // 🔥 ADD THIS (VERY IMPORTANT)

    private String type;
    private Double amount;
    private String date;
    private String receiver;

    private String status;

    public Transaction() {}

    public Transaction(String phone, String type, double amount, String date, String receiver, String status) {
        this.phone = phone;
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.receiver = receiver;
        this.status = status;
    }

    // getters & setters

    public Long getId() { return id; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getReceiver() { return receiver; }
    public void setReceiver(String receiver) { this.receiver = receiver; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}