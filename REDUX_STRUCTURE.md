# Redux Toolkit Structure for React + TypeScript Application

This document outlines the recommended folder structure and implementation details for integrating Redux Toolkit with TypeScript in a React application.

## Folder Structure

```
src/
├── store/                   # Main Redux store directory
│   ├── index.ts             # Store configuration and type definitions
│   └── slices/              # Redux slices
│       ├── authSlice.ts     # Authentication slice
│       ├── usersSlice.ts    # Users slice
│      
├── providers/               # React context providers
│   └── StoreProvider.tsx    # Redux store provider component
├── components/              # React components using Redux
│   ├── AuthExample.tsx      # Auth example component
│   └── TasksExample.tsx     # Tasks example component
└── App.tsx                  # Main application component
```

## Implementation Details

### 1. Store Configuration (`src/store/index.ts`)

- Configures the Redux store using `configureStore`
- Sets up Redux Persist for state persistence
- Defines TypeScript types for RootState and AppDispatch
- Exports typed hooks for useSelector and useDispatch

### 2. Slice Implementation (e.g., `src/store/slices/authSlice.ts`)

Each slice includes:
- TypeScript interfaces for state and related entities
- Initial state definition
- Async thunks for API operations using `createAsyncThunk`
- Reducers using `createSlice`
- Selectors for accessing state
- Exported action creators

### 3. Store Provider (`src/providers/StoreProvider.tsx`)

- Wraps the application with Redux Provider and PersistGate
- Provides Redux store to all components

### 4. Component Integration (e.g., `src/components/AuthExample.tsx`)

- Demonstrates how to use typed Redux hooks
- Shows proper TypeScript usage with Redux
- Implements UI that interacts with Redux state

## Best Practices

1. **Type Safety**
   - Use proper TypeScript types throughout the Redux implementation
   - Avoid `any` types and type assertions
   - Define explicit types for actions and state

2. **Async Operations**
   - Use `createAsyncThunk` for all async operations
   - Handle loading, success, and error states in reducers
   - Use the `rejectWithValue` function to return typed error messages

3. **State Structure**
   - Keep state normalized when dealing with collections
   - Use proper state shape for entity collections
   - Include loading and error states in each slice

4. **Persistence**
   - Only persist necessary parts of the state
   - Configure persistance whitelist or blacklist based on requirements
   - Handle serialization issues with middleware configuration

5. **Selectors**
   - Create selectors for accessing state in components
   - Consider memoized selectors for complex derivations using `createSelector`
   - Keep selectors close to the slice they access

## Using Redux in Components

1. Import the typed hooks:
   ```typescript
   import { useAppDispatch, useAppSelector } from '../store';
   ```

2. Import selectors and actions:
   ```typescript
   import { login, selectUser } from '../store/slices/authSlice';
   ```

3. Use typed hooks in components:
   ```typescript
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   ```

4. Dispatch actions with proper typing:
   ```typescript
   dispatch(login({ email: 'user@example.com', password: 'password' }));
   ```

## Adding New Slices

To add a new slice to your Redux store:

1. Create a new file in the `src/store/slices` directory
2. Define state interface and initial state
3. Create thunks for async operations
4. Create the slice with reducers and extraReducers
5. Export actions, selectors, and reducer
6. Add the reducer to the root reducer in `src/store/index.ts` 