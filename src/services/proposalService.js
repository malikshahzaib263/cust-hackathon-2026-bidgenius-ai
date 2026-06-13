export function exportProposalText(sections) {
  return sections.map((section) => `${section.title}\n${section.body}`).join("\n\n");
}
