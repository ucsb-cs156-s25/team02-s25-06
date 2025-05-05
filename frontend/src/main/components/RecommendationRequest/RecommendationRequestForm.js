import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function RecommendationRequestForm({
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

  const testIdPrefix = "RecommendationRequestForm";

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
        <Form.Label htmlFor="requesterEmail">RequesterEmail</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-requesterEmail"}
          id="requesterEmail"
          type="text"
          isInvalid={Boolean(errors.requesterEmail)}
          {...register("requesterEmail", {
            required: "Requester email is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requesterEmail?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="professorEmail">ProfessorEmail</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-professorEmail"}
          id="professorEmail"
          type="text"
          isInvalid={Boolean(errors.professorEmail)}
          {...register("professorEmail", {
            required: "Professor email is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.professorEmail?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="explanation">Explanation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-explanation"}
          id="explanation"
          type="text"
          isInvalid={Boolean(errors.explanation)}
          {...register("explanation", {
            required: "Explanation is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="dateRequested">Date Requested</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-dateRequested"}
          id="dateRequested"
          type="date"
          isInvalid={Boolean(errors.dateRequested)}
          {...register("dateRequested", {
            required: "Date Requested is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.dateRequested?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="dateNeeded">Date Needed</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-dateNeeded"}
          id="dateNeeded"
          type="date"
          isInvalid={Boolean(errors.dateNeeded)}
          {...register("dateNeeded", {
            required: "Date Needed is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.dateNeeded?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="done">
        <Form.Check
          type="checkbox"
          label="Done"
          data-testid={`${testIdPrefix}-done`}
          {...register("done")}
        />
        <Form.Control.Feedback type="invalid">
          {errors.done?.message}
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

export default RecommendationRequestForm;
