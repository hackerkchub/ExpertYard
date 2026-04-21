import {
  StateAction,
  StateBody,
  StateCard,
  StateDescription,
  StateEyebrow,
  StateIcon,
  StateTitle,
} from "./StateBlock.styles";

export default function StateBlock({
  eyebrow,
  title,
  description,
  icon = null,
  action = null,
  compact = false,
}) {
  return (
    <StateCard $compact={compact}>
      {icon ? <StateIcon aria-hidden="true">{icon}</StateIcon> : null}
      <StateBody>
        {eyebrow ? <StateEyebrow>{eyebrow}</StateEyebrow> : null}
        {title ? <StateTitle>{title}</StateTitle> : null}
        {description ? <StateDescription>{description}</StateDescription> : null}
        {action ? <StateAction>{action}</StateAction> : null}
      </StateBody>
    </StateCard>
  );
}
