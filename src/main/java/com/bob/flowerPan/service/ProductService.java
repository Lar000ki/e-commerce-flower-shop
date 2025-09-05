package com.bob.flowerPan.service;

import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.repository.ProductRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepo repository;

    public ProductService(ProductRepo repository) {
        this.repository = repository;
    }

    public List<Product> findAll(){
        return repository.findAll();
    }

    public void saveProduct(Product product){
        repository.save(product);
    }

    public void delete(long id){
        repository.deleteById(id);
    }
}
