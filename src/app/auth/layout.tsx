import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="p-4 sm:px-8 md:flex md:flex-col md:items-center">
      {children}
    </div>
  );
}
