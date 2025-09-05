package com.bob.flowerPan.service;

import com.bob.flowerPan.dto.OrderDto;
import com.bob.flowerPan.dto.OrderMapper;
import com.bob.flowerPan.model.Order;
import com.bob.flowerPan.model.OrderItem;
import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.repository.OrderRepo;
import com.bob.flowerPan.repository.ProductRepo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class OrderService {

    private final OrderRepo repository;
    private final ProductRepo productRepo;

    public OrderService(OrderRepo repository, ProductRepo productRepo){
        this.repository = repository;
        this.productRepo = productRepo;
    }

//    public List<Order> findAll(){
//        return repository.findAll();
//    }

//    @Transactional
//    public void saveOrder(Order order){
//        // связываем каждый OrderItem с заказом
//        for (OrderItem item : order.getItems()) {
//            item.setOrder(order);
//
//            // если приходит только product.id – подтягиваем продукт из БД
//            if (item.getProduct() != null && item.getProduct().getId() != 0) {
//                Product product = productRepo.findById(item.getProduct().getId())
//                        .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getId()));
//                item.setProduct(product);
//            }
//        }
//
//    repository.save(order); // каскад сохранит и items
//}

    public List<OrderDto> findAll(){
        return repository.findAll().stream()
                .map(OrderMapper::toDto)
                .toList();
    }

    public void saveOrder(Order order){
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
        }
        repository.save(order);
    }

    public void delete(long id){
        repository.deleteById(id);
    }
}
