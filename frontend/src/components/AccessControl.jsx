import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * @param {boolean} isAuth
 * @param {string|string[]} roles
 * @param {ReactNode} children
 * @param {ReactNode} fallback
 */
const AccessControl = ({ isAuth, roles, children, fallback = null }) => {
  const { isAuthenticated, hasRole } = useContext(AuthContext);

  // Check authentication
  if (isAuth !== undefined) {
    if (isAuth !== isAuthenticated) {
      return fallback;
    }
  }

  // Check roles
  if (roles) {
    if (!isAuthenticated || !hasRole(roles)) {
      return fallback;
    }
  }

  return <>{children}</>;
};

export default AccessControl;
