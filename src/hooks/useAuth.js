import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "@/features/auth/authApiSlice";
import { userDetailsFetched } from "@/features/auth/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  const { data, isSuccess, isLoading, refetch } = useGetCurrentUserQuery(
    undefined,
    {
      skip: !isAuthenticated,
    }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthChecked(true);
      // Reset document title when not authenticated
      document.title = "SquadCart Console";
      return;
    }

    // Show loading state while fetching user data
    if (isLoading) {
      document.title = "Loading... - Admin Console";
      return;
    }

    // Set authChecked to true when authenticated
    setAuthChecked(true);

    if (data) {
      // Dispatch user details to store
      dispatch(userDetailsFetched(data));
      
      // Update document title with company name and company ID from API
      const companyName = data.companyName || "Admin Console";
      const companyId = data.companyId || "";
      
      if (companyId) {
        document.title = `${companyName} (${companyId}) - Admin Console`;
      } else {
        document.title = `${companyName} - Admin Console`;
      }
    }
  }, [
    isSuccess,
    data,
    dispatch,
    isAuthenticated,
    isLoading,
  ]);

  return {
    isLoading: isLoading || (isAuthenticated && !authChecked),
    authChecked,
    refetchProfile: refetch,
  };
};

export default useAuth;
