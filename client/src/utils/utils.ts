import { testNoteGroups } from "@/constants";
import { _User } from "@/types/_user";
import { NewNote } from "@/types/note";

export const debounce = <T extends (...args: any[]) => Promise<void> | void>(
  func: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      void func(...args);
    }, delay);
  };
};

export const getActionVerb = (intent: string): string => {
  switch (intent) {
    case "delete_notes":
    case "delete_all":
      return "found these notes for deletion";
    case "edit_notes":
      return "found these notes for editing";
    case "create_note":
      return "created this note";
    case "request":
      return "created this content";
    case "search":
      return "found these notes";
    case "show_all":
      return "shown all your notes";
    default:
      return "processed your request";
  }
};
