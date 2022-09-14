import { ReactNode } from 'react';

interface ChipsProps {
  children: ReactNode;
}

const Chips = (props: ChipsProps) => {
  const { children } = props;
  return (
    <div className="Chips">
      {children}
      <i className="bi bi-x-square" />
    </div>
  );
};

export default Chips;
