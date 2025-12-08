import React from "react";
import {
  SuggestBox,
  SuggestItem,
  SuggestText,
  SuggestTitle,
  SuggestMeta,
  SuggestType,
  SuggestEmpty,
} from "../styles/Topbar.styles";

export default function SearchSuggestions({
  suggestions,
  loading,
  onSelect,
}) {
  if (!loading && suggestions.length === 0) {
    return (
      <SuggestBox>
        <SuggestEmpty>No matches found</SuggestEmpty>
      </SuggestBox>
    );
  }

  return (
    <SuggestBox>
      {loading && (
        <SuggestEmpty>Searching…</SuggestEmpty>
      )}

      {!loading &&
        suggestions.map((s) => (
          <SuggestItem key={s.id} onClick={() => onSelect(s)}>
            <SuggestText>
              <SuggestTitle>{s.label}</SuggestTitle>
              {s.meta && <SuggestMeta>{s.meta}</SuggestMeta>}
            </SuggestText>
            <SuggestType>{s.typeLabel}</SuggestType>
          </SuggestItem>
        ))}
    </SuggestBox>
  );
}
