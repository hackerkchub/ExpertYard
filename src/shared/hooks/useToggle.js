export default function useToggle(initial = false) {
  const [state, setState] = React.useState(initial);
  return [state, () => setState(v => !v)];
}
