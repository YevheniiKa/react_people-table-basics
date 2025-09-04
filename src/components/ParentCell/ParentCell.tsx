import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';

type Props = {
  parentName?: string;
  getParentSlug: (name: string) => string | null;
  isMother?: boolean;
};

export const ParentCell: React.FC<Props> = ({
  parentName,
  getParentSlug,
  isMother,
}) => {
  if (!parentName) {
    return <td>-</td>;
  }

  const slug = getParentSlug(parentName);

  return (
    <td>
      {slug ? (
        <Link
          to={`/people/${slug}`}
          className={cn({
            'has-text-danger': isMother,
          })}
        >
          {parentName}
        </Link>
      ) : (
        parentName
      )}
    </td>
  );
};
