import { useEffect, useState, useRef } from "react";

type Country = {
  name: string;
  callingCode: string;
  code: string;
  flagUrl: string;
};

export type PhoneInputData = {
  full: string;
  callingCode: string;
  localNumber: string;
  countryCode: string;
};

type Props = {
  value?: string;
  onChange?: (data: PhoneInputData) => void;
  defaultCountry?: string;
  classNames?: {
    container?: string;
    inputWrapper?: string;
    button?: string;
    input?: string;
    dropdown?: string;
    dropdownItem?: string;
  };
};

async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function PhoneInputCustom({
  value = "",
  onChange,
  defaultCountry = "bj",
  classNames = {},
}: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const fetchCountries = async () => {
      const cached = localStorage.getItem("countryData");

      if (cached) {
        const parsed = JSON.parse(cached);

        setCountries(parsed);
        initFromValueOrDefault(parsed);

        return;
      }

      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,idd,cca2",
      );
      const data = await res.json();

      const formatted = (
        await Promise.all(
          data.map(async (country: any) => {
            const callingCode =
              country.idd?.root + (country.idd?.suffixes?.[0] || "");

            if (!callingCode) return null;

            const codeLower = country.cca2.toLowerCase();
            const flagUrl = `https://flagcdn.com/w40/${codeLower}.png`;

            let flagBase64 = "";

            try {
              flagBase64 = await imageUrlToBase64(flagUrl);
            } catch {
              flagBase64 = flagUrl;
            }

            return {
              name: country.name.common,
              callingCode,
              code: codeLower,
              flagUrl: flagBase64,
            };
          }),
        )
      ).filter(Boolean) as Country[];

      formatted.sort((a, b) => a.name.localeCompare(b.name));

      setCountries(formatted);
      localStorage.setItem("countryData", JSON.stringify(formatted));
      initFromValueOrDefault(formatted);
    };

    fetchCountries();
  }, []);

  const initFromValueOrDefault = (list: Country[]) => {
    if (!initializedRef.current) {
      if (value) {
        const country = list.find((c) => value.startsWith(c.callingCode));

        if (country) {
          setSelected(country);
          initializedRef.current = true;

          return;
        }
      }

      const defaultSelected = list.find(
        (c) => c.code === defaultCountry.toLowerCase(),
      );

      if (defaultSelected) {
        setSelected(defaultSelected);
        initializedRef.current = true;
      }
    }
  };

  // Sync selected country when value changes
  useEffect(() => {
    if (value && countries.length > 0 && selected) {
      const country = countries.find((c) => value.startsWith(c.callingCode));

      if (country && country.code !== selected.code) {
        setSelected(country);
      }
    }
  }, [value, countries]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (dropdownOpen) {
        const target = e.target as HTMLElement;

        if (containerRef.current && !containerRef.current.contains(target)) {
          setDropdownOpen(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, true);

    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [dropdownOpen]);

  const selectCountry = (country: Country) => {
    setSelected(country);
    setDropdownOpen(false);

    if (onChange) {
      const localNumber = value
        ? selected
          ? value.startsWith(selected.callingCode)
            ? value.slice(selected.callingCode.length)
            : value
          : value
        : "";

      onChange({
        full: country.callingCode + localNumber,
        callingCode: country.callingCode,
        localNumber: localNumber,
        countryCode: country.code,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative  ${classNames.container || "w-full"}`}
    >
      <div
        className={`flex items-center focus:border-primary focus:ring-[1px] focus:ring-primary/5 
            focus:scale-[1.01] bg-white/5 rounded-lg px-2 py-2 gap-2 text-white w-full
          ${isInputFocused && "ring-[1px] ring-primary hover:bg-white"}
          ${classNames.inputWrapper || ""}
        `}
      >
        <button
          type="button"
          onClick={() => setDropdownOpen((o) => !o)}
          className={`flex items-center gap-2 focus:outline-none cursor-pointer ${
            classNames.button || ""
          }`}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
        >
          {selected ? (
            <>
              <img
                src={selected.flagUrl}
                alt={selected.name}
                className="w-5 h-5 rounded-full object-cover cursor-pointer"
              />
              {}
              <svg
                className={`w-4 h-4 text-foreground transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          ) : (
            <span className="select-none text-white/60">Choisir pays</span>
          )}
        </button>

        <input
          type="tel"
          className={`bg-transparent placeholder-white/50 focus:outline-none h-full w-full font-normal ${
            classNames.input || ""
          }`}
          placeholder="0197460813"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          value={
            selected && value
              ? value.startsWith(selected.callingCode)
                ? value.slice(selected.callingCode.length)
                : value
              : ""
          }
          onChange={(e) => {
            if (selected && onChange) {
              const localNumber = e.target.value;

              onChange({
                full: selected.callingCode + localNumber,
                callingCode: selected.callingCode,
                localNumber: localNumber,
                countryCode: selected.code,
              });
            }
          }}
        />
      </div>

      {dropdownOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            classNames.dropdown || ""
          }`}
        >
          {countries.map((country) => (
            <li
              key={country.code}
              role="option"
              aria-selected={selected?.code === country.code}
              tabIndex={0}
              onClick={() => selectCountry(country)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  selectCountry(country);
                }
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-600 hover:text-white ${
                classNames.dropdownItem || ""
              }`}
            >
              <img
                src={country.flagUrl}
                alt={country.name}
                className="w-6 h-4 rounded object-cover"
              />
              <span>{country.name}</span>
              <span className="ml-auto font-mono text-sm">
                {country.callingCode}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}