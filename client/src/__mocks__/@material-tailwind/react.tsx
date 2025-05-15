import { ReactNode } from 'react';

interface ComponentProps {
  children?: ReactNode;
  [key: string]: any;
}

export const Typography = ({ children, ...props }: ComponentProps) => <div {...props}>{children}</div>;
export const Dialog = ({ children, ...props }: ComponentProps) => <div {...props}>{children}</div>;
export const DialogHeader = ({ children, ...props }: ComponentProps) => <div {...props}>{children}</div>;
export const DialogBody = ({ children, ...props }: ComponentProps) => <div {...props}>{children}</div>;
export const IconButton = ({ children, ...props }: ComponentProps) => <button {...props}>{children}</button>;
export const Button = ({ children, ...props }: ComponentProps) => <button {...props}>{children}</button>;
export const Input = ({ children, ...props }: ComponentProps) => <input {...props}>{children}</input>;
export const Textarea = ({ children, ...props }: ComponentProps) => <textarea {...props}>{children}</textarea>;
export const Card = ({ children, ...props }: ComponentProps) => <div {...props}>{children}</div>;
export const CardHeader = ({ children, ...props }: ComponentProps) => <div {...props}>{children}</div>;
export const CardBody = ({ children, ...props }: ComponentProps) => <div {...props}>{children}</div>;
export const CardFooter = ({ children, ...props }: ComponentProps) => <div {...props}>{children}</div>; 