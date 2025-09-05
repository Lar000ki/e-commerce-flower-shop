package com.bob.flowerPan.controller;

import com.bob.flowerPan.dto.OrderDto;
import com.bob.flowerPan.model.Order;
import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

//    @GetMapping("/all")
//    //need cacheable
//    public ResponseEntity<List<Order>> getAll(){
//        return ResponseEntity.ok(orderService.findAll());
//    }
    @GetMapping("/all")
    public ResponseEntity<List<OrderDto>> getAll(){
        return ResponseEntity.ok(orderService.findAll());
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveOrder(@Valid @RequestBody Order order){
        orderService.saveOrder(order);
        return ResponseEntity.ok("ok");
    }

    @DeleteMapping
    public ResponseEntity<String> delete(@RequestParam long id){
        orderService.delete(id);
        return ResponseEntity.ok("ok");
    }
}
