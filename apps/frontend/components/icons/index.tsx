export const EyeFilledIcon = ({
  className = "w-6 h-6",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    fillRule="evenodd"
    clipRule="evenodd"
    className={className}
    viewBox="0 0 20 20"
    {...props}
  >
    <path d="M10 3c-3.9 0-7.7 1.9-10 5 2.3 3.1 6.1 5 10 5s7.7-1.9 10-5c-2.3-3.1-6.1-5-10-5zM10 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
  </svg>
);

export const EyeSlashFilledIcon = ({
  className = "w-6 h-6",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    fillRule="evenodd"
    clipRule="evenodd"
    className={className}
    viewBox="0 0 20 20"
    {...props}
  >
    <path d="M10 5c-3.9 0-7.7 1.9-10 5 1 1.3 2.3 2.5 3.8 3.4L2.3 9.7c-1.9-1.5-3.3-3-3.8-3.4 2.3-3.1 6.1-5 10-5 1.4 0 2.8.2 4.1.6L12.3 5.8c-1.4-.5-2.7-.8-4.3-.8zm7.9 8.3L17.7 10.3c1.9 1.5 3.3 3 3.8 3.4-2.3 3.1-6.1 5-10 5-1.4 0-2.8-.2-4.1-.6l1.9-2.5c1.4.5 2.7.8 4.3.8 2.2 0 4-1.8 4-4 0-.9-.3-1.7-.8-2.4zM10 14c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z" />
  </svg>
);

export const CheckIcon = ({
  className = "w-6 h-6",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    fillRule="evenodd"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
