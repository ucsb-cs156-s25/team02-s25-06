package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.Article;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The ArticleRepository is a repository for Articles.
 */

@Repository
public interface ArticleRepository extends CrudRepository<Article, Long> {

}