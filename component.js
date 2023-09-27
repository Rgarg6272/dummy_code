const FancyLink = React.forwardRef(({ navigate, ...props }, ref) => {
  return (
    <a ref={ref} {...props} onClick={handleClick}>💅 {props.children}</a>
  )
})

<Link to="/" component={FancyLink} />

