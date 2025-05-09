package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticleWebIT extends WebTestCase {

    @Test
    public void admin_user_can_create_article() throws Exception {
        setupUser(true); // true = isAdmin

        page.getByText("Articles").click();

        page.getByText("Create Article").click();
        assertThat(page.getByText("Create New Article")).isVisible();

        page.getByTestId("ArticleForm-title").fill("Test Article");
        page.getByTestId("ArticleForm-url").fill("https://example.com");
        page.getByTestId("ArticleForm-explanation").fill("This is a test");
        page.getByTestId("ArticleForm-email").fill("test@example.com");
        page.getByTestId("ArticleForm-dateAdded").fill("2025-05-06T00:00");
        page.getByTestId("ArticleForm-submit").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).hasText("Test Article");
        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-url")).hasText("https://example.com");
    }
}
