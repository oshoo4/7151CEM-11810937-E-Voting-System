
export const handle403Error = (error, navigate) => {
    if (error?.response?.status === 403) {
      try {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
  
        if (user?.user?.role === 'Staff') {
          navigate('/staff');
        } else if (user?.user?.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/login');
        }
      } catch (parseError) {
        console.error("Failed to parse user from localStorage:", parseError);
        navigate('/login');
      }
    }
  };