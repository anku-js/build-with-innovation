import { FaFilter } from "react-icons/fa";
import "./Sidebar.css";

interface Props {
  priceFilter: string;
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Sidebar({ priceFilter, handleFilterChange }: Props) {
  const priceRanges = [
    { label: "All", value: "" },
    { label: "Below 200", value: "0-200" },
    { label: "Rs.201 - Rs.400", value: "201-400" },
    { label: "Rs.401 - Rs.600", value: "401-600" },
    { label: "Rs.601 - Rs.800", value: "601-800" },
    { label: "Rs.801 - Rs.1000", value: "801-1000" },
    { label: "Above 1000", value: "over1000" },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <FaFilter />
        <h1 className="sidebar-heading">Filter</h1>
      </div>

      <p className="price-range-text">Price range</p>
      <div className="filter-range">
        {priceRanges.map(({ label, value }) => (
          <label className="filter-label" key={label}>
            <input
              type="radio"
              name="price"
              className="filter-input"
              value={value}
              checked={priceFilter === value}
              onChange={handleFilterChange}
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
