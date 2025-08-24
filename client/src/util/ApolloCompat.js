import React from 'react';
import { useQuery, useMutation } from '@apollo/client';

/**
 * Query compat: mirrors <Query>{({loading,error,data}) => ...}</Query>
 */
export function Query({ query, variables, children, fetchPolicy, pollInterval, notifyOnNetworkStatusChange }) {
  const result = useQuery(query, { variables, fetchPolicy, pollInterval, notifyOnNetworkStatusChange });
  return children(result);
}

/**
 * Mutation compat: mirrors <Mutation>{(mutate, result) => ...}</Mutation>
 * Also supports default variables via the `variables` prop like the old API.
 */
export function Mutation({ mutation, variables: defaultVariables, children, refetchQueries, awaitRefetchQueries, update, onCompleted, onError, optimisticResponse }) {
  const [mutate, result] = useMutation(mutation, { refetchQueries, awaitRefetchQueries, update, onCompleted, onError, optimisticResponse });
  const wrapped = (options = {}) => {
    const merged = { ...(options || {}) };
    if (defaultVariables || options.variables) {
      merged.variables = { ...(defaultVariables || {}), ...(options.variables || {}) };
    }
    return mutate(merged);
  };
  return children(wrapped, result);
}
