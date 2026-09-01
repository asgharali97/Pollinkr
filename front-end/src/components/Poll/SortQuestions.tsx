import {
  IconX,
  IconPlus,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons-react";
import { useFieldArray, Controller } from "react-hook-form";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FieldError } from "./FieldError";

export function SortableQuestion({
  id,
  qIndex,
  control,
  register,
  errors,
  onRemove,
  canRemove,
}: {
  id: string;
  qIndex: number;
  control: any;
  register: any;
  errors: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const {
    fields: options,
    append: addOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${qIndex}.options`,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border border-border bg-card p-5 space-y-4 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-2.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
          aria-label="Drag to reorder"
        >
          <IconGripVertical size={16} />
        </button>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Q{qIndex + 1}
            </span>
            <div className="flex items-center gap-3">
              <Controller
                control={control}
                name={`questions.${qIndex}.mandatory`}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`text-xs px-2.5 py-1 rounded-full shadow-m transition-colors ${
                      field.value
                        ? "shadow-black/5 ring-1 ring-black/10 border-foreground/30 text-foreground bg-primary-foreground"
                        : "text-muted-foreground"
                    } cursor-pointer`}
                  >
                    {field.value ? "Required" : "Optional"}
                  </button>
                )}
              />
              {canRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Remove question"
                >
                  <IconTrash size={14} />
                </button>
              )}
            </div>
          </div>

          <input
            {...register(`questions.${qIndex}.text`)}
            placeholder="Enter your question"
            className={`poll-input text-sm ${
              errors.questions?.[qIndex]?.text ? "border-red-400" : ""
            }`}
          />
          {errors.questions?.[qIndex]?.text && (
            <FieldError message={errors.questions[qIndex].text.message} />
          )}
        </div>
      </div>

      <div className="pl-7 space-y-2">
        <p className="text-xs text-muted-foreground font-medium mb-2">
          Options
        </p>
        {options.map((opt, oIndex) => (
          <div key={opt.id} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border border-border flex-shrink-0" />
            <input
              {...register(`questions.${qIndex}.options.${oIndex}.text`)}
              placeholder={`Option ${oIndex + 1}`}
              className={`poll-input text-sm flex-1 ${
                errors.questions?.[qIndex]?.options?.[oIndex]?.text
                  ? "border-red-400"
                  : ""
              }`}
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(oIndex)}
                className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
              >
                <IconX size={13} />
              </button>
            )}
          </div>
        ))}

        {errors.questions?.[qIndex]?.options?.root && (
          <FieldError message={errors.questions[qIndex].options.root.message} />
        )}

        <button
          type="button"
          onClick={() => addOption({ text: "" })}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          <IconPlus size={12} />
          Add option
        </button>
      </div>
    </div>
  );
}
