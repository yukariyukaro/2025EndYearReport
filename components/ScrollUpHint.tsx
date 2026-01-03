export default function ScrollUpHint() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="hint-wrapper">
      <img src={`${basePath}/imgs/hint.svg`} alt="" />
    </div>
  );
}
