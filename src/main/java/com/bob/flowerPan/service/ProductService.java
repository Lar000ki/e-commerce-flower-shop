package com.bob.flowerPan.service;

import com.bob.flowerPan.model.Product;
import com.bob.flowerPan.repository.ProductRepo;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

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

    public void savePhoto(long id, MultipartFile file) throws IOException {
        String uploadDir = "img/";
        Files.createDirectories(Paths.get(uploadDir));
        Product product = repository.findById(id).orElseThrow(() -> new RuntimeException("Продукт не найден"));

        if (product.getImageUrl() != null) {
            Path oldPath = Paths.get(uploadDir + product.getImageUrl());
            Files.deleteIfExists(oldPath);
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + fileName);
        Files.write(path, file.getBytes());

        product.setImageUrl(fileName);
        repository.save(product);
    }

    public Resource getPhoto(String filename) throws IOException {
        Path path = Paths.get("img/").resolve(filename);
        return new UrlResource(path.toUri());
    }
}
