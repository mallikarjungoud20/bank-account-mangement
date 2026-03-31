package com.bank.bank_backend.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private String fromPhone;
    private String toPhone;
    private Double amount;

    // 📱 EXPLICIT GETTERS
    public String getFromPhone() {
        return fromPhone;
    }

    public String getToPhone() {
        return toPhone;
    }

    public Double getAmount() {
        return amount;
    }

    // SETTERS
    public void setFromPhone(String fromPhone) {
        this.fromPhone = fromPhone;
    }

    public void setToPhone(String toPhone) {
        this.toPhone = toPhone;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}