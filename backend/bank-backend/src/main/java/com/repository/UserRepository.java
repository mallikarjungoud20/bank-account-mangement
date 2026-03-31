package com.bank.bank_backend.repository;

import com.bank.bank_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByPhoneAndPassword(String phone, String password);
User findByPhone(String phone);
}