import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const HomeSearch = React.memo(function HomeSearch({ onSearch, selectedCategoryName }) {
  const [value, setValue] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className="home-search" onSubmit={submit}>
      <Search size={19} aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search experts, services, categories"
        aria-label="Search experts, services, categories"
      />
      {selectedCategoryName ? <span>{selectedCategoryName}</span> : null}
      <button type="submit" aria-label="Search">
        <SlidersHorizontal size={18} />
      </button>
    </form>
  );
});

export default HomeSearch;
