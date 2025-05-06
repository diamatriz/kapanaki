  //Animation settings
  export const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1, //Custom appearing delay
        duration: 0.3,
        type: "spring",
        damping: 30,
        stiffness: 500
      }
    }),
    exit: { opacity: 0, x: 100 }
  };