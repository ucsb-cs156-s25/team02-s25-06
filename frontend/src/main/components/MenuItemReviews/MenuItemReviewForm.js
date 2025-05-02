import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function MenuItemReviewForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "MenuItemReviewForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="itemId">ItemId</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-itemId"}
          id="itemId"
          type="number"
          isInvalid={Boolean(errors.name)}
          {...register("itemId", {
            required: "itemId is required.",
            maxLength: {
              value: 30,
              message: "Max length 30 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.itemId?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="reviewerEmail">ReviewerEmail</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-reviewerEmail"}
          id="reviewerEmail"
          type="text"
          isInvalid={Boolean(errors.name)}
          {...register("reviewerEmail", {
            required: "reviewerEmail is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.reviewerEmail?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="stars">Stars</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-stars"}
          id="stars"
          type="number"
          isInvalid={Boolean(errors.name)}
          {...register("stars", {
            required: "stars is required.",
            min: {
              value: 0,
              message: "Stars must be at least 0",
            },
            max: {
              value: 5,
              message: "Stars must be at most 5",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.stars?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="comments">Comments</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-comments"}
          id="comments"
          type="text"
          isInvalid={Boolean(errors.comments)}
          {...register("comments", {
            required: "comments are required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.comments?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="dateReviewed">DateReviewed</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-dateReviewed"}
          id="dateReviewed"
          type="datetime-local"
          isInvalid={Boolean(errors.name)}
          {...register("dateReviewed", {
            required: "dateReviewed is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.dateReviewed?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default MenuItemReviewForm;
