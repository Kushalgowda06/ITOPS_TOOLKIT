import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchfieldProps {
  onSearch: (searchText: string) => void;
}

function Searchfield({ onSearch }: SearchfieldProps): React.ReactElement {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    onSearch(searchText);
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        onChange={handleSearch}
      />
      <div className="input-group-append">
        <span className="input-group-text">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
    </div>
  );
}

export default Searchfield;
