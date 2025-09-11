package com.bob.flowerPan.controller;

import com.bob.flowerPan.dto.OrderDto;
import com.bob.flowerPan.model.Order;
import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.service.OrderService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderDto>> getAll(){
        return ResponseEntity.ok(orderService.findAll());
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveOrder(@Valid @RequestBody Order order){
        order.setPaid(false);
        orderService.saveOrder(order, false);
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/adminsave")
    public ResponseEntity<String> adminSaveOrder(@Valid @RequestBody Order order){
        orderService.saveOrder(order, true);
        return ResponseEntity.ok("ok");
    }

    @DeleteMapping
    public ResponseEntity<String> delete(@RequestParam long id){
        orderService.delete(id);
        return ResponseEntity.ok("ok");
    }
}
