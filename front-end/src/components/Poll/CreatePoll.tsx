import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { FieldError } from "./FieldError";
import { SortableQuestion } from "./SortQuestions";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  IconPlus,
  IconX,
  IconClock,
  IconLock,
  IconLockOpen,
  IconChevronDown,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useGetPoll,
  useCreatePoll,
  useUpdatePoll,
  type CreatePollPayload,
  type UpdatePollPayload,
} from "@/hooks";

const optionSchema = z.object({
  text: z.string().min(1, "Option can't be empty"),
});

const questionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Question text is required"),
  mandatory: z.boolean(),
  options: z.array(optionSchema).min(2, "At least 2 options required"),
});

const pollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  anonymous: z.boolean(),
  expiresAt: z.string().optional(),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

type PollForm = z.infer<typeof pollSchema>;

const defaultQuestion = (): PollForm["questions"][0] => ({
  id: crypto.randomUUID(),
  text: "",
  mandatory: true,
  options: [{ text: "" }, { text: "" }],
});

export default function CreatePoll() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [date, setDate] = useState<Date>();
  const [isFormReady, setIsFormReady] = useState(!isEdit);

  const { data: pollData, isLoading: pollLoading } = useGetPoll(id);
  const createMutation = useCreatePoll();
  const updateMutation = useUpdatePoll(id!);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PollForm>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: "",
      description: "",
      anonymous: false,
      expiresAt: "",
      questions: [defaultQuestion()],
    },
  });
  const {
    fields: questions,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "questions",
  });
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (isEdit && pollData) {
      const expiryDate = pollData.poll.expiresAt
        ? new Date(pollData.poll.expiresAt)
        : undefined;
      const timer = setTimeout(() => setDate(expiryDate), 0);

      reset({
        title: pollData.poll.title,
        description: pollData.poll.description || "",
        anonymous: pollData.poll.anonymous,
        expiresAt: pollData.poll.expiresAt || "",
        questions: pollData.poll.questions.map((q) => ({
          id: q.id,
          text: q.text,
          mandatory: q.mandatory,
          options: q.options.map((o) => ({ text: o.text })),
        })),
      });
      const formReadyTimer = setTimeout(() => setIsFormReady(true), 0);

      return () => {
        clearTimeout(formReadyTimer);
        clearTimeout(timer);
      };
    }
  }, [isEdit, pollData, reset]);

  if (isEdit && pollLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading poll...
      </div>
    );
  }

  if (isEdit && !pollData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-red-500">
        Poll not found
      </div>
    );
  }

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    move(oldIndex, newIndex);
  };

  const onSubmit = async (data: PollForm, mode: "draft" | "publish") => {
    try {
      const expiresAt = date ? endOfSelectedDay(date).toISOString() : null;

      if (isEdit) {
        const updatePayload: UpdatePollPayload = {
          title: data.title,
          description: data.description,
          isAnonymous: data.anonymous,
          responseMode: data.anonymous ? "anonymous" : "authenticated",
          expiresAt: expiresAt || undefined,
          status: mode === "publish" ? "active" : "draft",
          questions: data.questions.map((question) => ({
            text: question.text,
            mandatory: question.mandatory,
            options: question.options.map((option) => ({ text: option.text })),
          })),
        };
        await updateMutation.mutateAsync(updatePayload);
        toast.success("Poll updated");
        navigate(`/polls/${id}/analytics`);
      } else {
        const createPayload: CreatePollPayload = {
          title: data.title,
          description: data.description,
          responseMode: data.anonymous ? "anonymous" : "authenticated",
          isAnonymous: data.anonymous,
          expiresAt: expiresAt || undefined,
          status: mode === "publish" ? "active" : "draft",
          questions: data.questions.map((question) => ({
            text: question.text,
            mandatory: question.mandatory,
            options: question.options.map((option) => ({ text: option.text })),
          })),
        };

        const response = await createMutation.mutateAsync(createPayload);
        toast.success(
          mode === "publish" ? "Poll published" : "Poll saved as draft",
        );
        // @ts-expect-error `id` is defined
        navigate(`/polls/${response.id}/analytics`);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Could not save poll";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 flex items-center gap-1"
          >
            <IconX size={12} /> Cancel
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? "Edit poll" : "Create poll"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEdit
              ? "Update your poll details and questions."
              : "Fill in the details, add your questions, then publish or save as draft."}
          </p>
        </div>

        {!isFormReady ? (
          <div className="text-center text-sm text-muted-foreground">
            Preparing form...
          </div>
        ) : (
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <section className="space-y-4">
              <Label text="Poll title" required />
              <input
                {...register("title")}
                placeholder="e.g. Q3 Product Feedback"
                className={`poll-input ${
                  errors.title
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : ""
                }`}
              />
              {errors.title && <FieldError message={errors.title.message} />}

              <Label text="Description" hint="optional" />
              <textarea
                {...register("description")}
                placeholder="Give respondents context about this poll."
                rows={3}
                className="poll-input resize-none"
              />
            </section>

            <section className="rounded-xl border border-border p-5 space-y-4">
              <p className="text-sm font-medium">Settings</p>

              <Controller
                control={control}
                name="anonymous"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {field.value ? (
                        <IconLockOpen
                          size={15}
                          className="text-muted-foreground"
                        />
                      ) : (
                        <IconLock size={15} className="text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {field.value
                            ? "Anonymous responses"
                            : "Authenticated responses"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {field.value
                            ? "Respondents are not identified."
                            : "Respondents must be signed in."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        field.value ? "bg-foreground" : "bg-border"
                      } cursor-pointer`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          field.value ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                )}
              />

              <div className="border-t border-border" />

              <div className="flex items-start gap-2.5">
                <IconClock size={15} className="text-muted-foreground mt-2.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Expiry date & time</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className={`w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground ${errors ? "" : "ring-red-400 ring-2"}`}
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <IconChevronDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        defaultMonth={date}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    After this time the poll closes automatically.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium">Questions</p>
                <span className="text-xs text-muted-foreground">
                  {questions.length} added
                </span>
              </div>

              {errors.questions?.root && (
                <FieldError message={errors.questions.root.message} />
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={questions.map((q) => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {questions.map((q, qIndex) => (
                      <SortableQuestion
                        key={q.id}
                        id={q.id}
                        qIndex={qIndex}
                        control={control}
                        register={register}
                        errors={errors}
                        onRemove={() => remove(qIndex)}
                        canRemove={questions.length > 1}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <button
                type="button"
                onClick={() => append(defaultQuestion())}
                className="mt-4 w-full py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <IconPlus size={15} />
                Add question
              </button>
            </section>

            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, "draft"))}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-6 py-2.5 rounded-lg shadow-m text-sm text-muted-foreground hover:text-foreground hover:shadow-black/5 hover:ring-1 ring-black/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                Save as draft
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, "publish"))}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-6 py-2.5 rounded-lg bg-foreground/90 text-background text-sm font-medium shadow-l cursor-pointer hover:bg-foreground hover:shadow-black/5 hover:ring-1 ring-black/10 transition-colors disabled:opacity-50"
              >
                {isEdit ? "Update poll" : "Publish poll"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function endOfSelectedDay(value: Date) {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
}

function Label({
  text,
  required,
  hint,
}: {
  text: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5 block">
      {text}
      {required && <span className="text-red-500 text-xs">*</span>}
      {hint && (
        <span className="text-xs text-muted-foreground font-normal">
          ({hint})
        </span>
      )}
    </label>
  );
}
