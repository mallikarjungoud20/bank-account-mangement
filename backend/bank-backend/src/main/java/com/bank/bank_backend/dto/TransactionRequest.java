package com.bank.bank_backend.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private String phone;
    private Double amount;

    // 📱 EXPLICIT GETTERS
    public String getPhone() {
        return phone;
    }

    public Double getAmount() {
        return amount;
    }

    // SETTERS
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}