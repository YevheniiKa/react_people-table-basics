// #region Import

import cn from 'classnames';
import { Link, useParams } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { useEffect, useState, useCallback } from 'react';
import { Person } from '../types/Person';
import { getPeople } from '../utils/fetchClient';

// #endregion

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { slug } = useParams();
  const activePerson = people.find(person => person.slug === slug) || null;

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  useEffect(() => {
    setLoading(true);
    getPeople()
      .then(setPeople)
      .catch(() => showError('Something went wrong'))
      .finally(() => setLoading(false));
  }, [showError]);

  const getParent = (parent: string) => {
    return people.find(person => person.name === parent) || null;
  };

  const findParent = (parent: string) => {
    let parentSlug = '';

    [...people].find(person =>
      person.name === parent ? (parentSlug = person.slug) : '',
    );

    return parentSlug;
  };

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="block">
        <div className="box table-container">
          {loading ? (
            <Loader />
          ) : (
            <>
              <table
                data-cy="peopleTable"
                className="table is-striped is-hoverable is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sex</th>
                    <th>Born</th>
                    <th>Died</th>
                    <th>Mother</th>
                    <th>Father</th>
                  </tr>
                </thead>

                <tbody>
                  {people.map(person => (
                    <>
                      <tr
                        data-cy="person"
                        key={person.slug}
                        className={cn({
                          'has-background-warning':
                            activePerson?.slug === person.slug,
                        })}
                      >
                        <td>
                          <Link
                            to={`/people/${person.slug}`}
                            className={cn({
                              'has-text-danger': person.sex === 'f',
                            })}
                          >
                            {person.name}
                          </Link>
                        </td>

                        <td>{person.sex}</td>
                        <td>{person.born}</td>
                        <td>{person.died}</td>

                        {person.motherName ? (
                          getParent(person.motherName) ? (
                            <td>
                              <Link
                                to={`/people/${findParent(person.motherName)}`}
                                onClick={() => {}}
                                className={cn({
                                  'has-text-danger': getParent(
                                    person?.motherName,
                                  ),
                                })}
                              >
                                {person.motherName}
                              </Link>
                            </td>
                          ) : (
                            <td>{person.motherName}</td>
                          )
                        ) : (
                          <td>-</td>
                        )}

                        {person.fatherName ? (
                          getParent(person.fatherName) ? (
                            <td>
                              <Link
                                to={`/people/${findParent(person.fatherName)}`}
                                onClick={() => {}}
                              >
                                {person.fatherName}
                              </Link>
                            </td>
                          ) : (
                            <td>{person.fatherName}</td>
                          )
                        ) : (
                          <td>-</td>
                        )}
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {errorMessage && (
            <>
              <p data-cy="peopleLoadingError" className="has-text-danger">
                {errorMessage}
              </p>
            </>
          )}
          {!loading && !errorMessage && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}
        </div>
      </div>
    </>
  );
};
