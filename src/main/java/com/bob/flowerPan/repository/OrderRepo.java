package com.bob.flowerPan.repository;

import com.bob.flowerPan.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepo extends JpaRepository<Order, Long> {
}
