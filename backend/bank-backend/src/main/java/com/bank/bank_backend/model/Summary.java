package com.bank.bank_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Summary {

    private double totalDeposit;
    private double totalWithdraw;
    private int totalTransactions;

    // 📊 EXPLICIT CONSTRUCTOR
    public Summary(double totalDeposit, double totalWithdraw, int count) {
        this.totalDeposit = totalDeposit;
        this.totalWithdraw = totalWithdraw;
        this.totalTransactions = count;
    }
}