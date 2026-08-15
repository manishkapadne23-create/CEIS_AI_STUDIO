export const FOCUS_CHAT_INPUT_EVENT = "sarathi:focus-chat-input";

export const requestChatInputFocus = (): void => {
  window.dispatchEvent(new CustomEvent(FOCUS_CHAT_INPUT_EVENT));
};
