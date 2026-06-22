export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Mentions et limites</h1>

      <div className="mt-6 space-y-4 text-sm text-zinc-700">
        <p>
          Ce projet est une démonstration pédagogique <strong>non officielle</strong>, sans
          lien avec l&apos;IUT de Metz, l&apos;Université de Lorraine ou le ministère de
          l&apos;Enseignement supérieur.
        </p>
        <p>
          L&apos;assistant utilise uniquement des sources publiques et officielles (voir{" "}
          <a href="/sources" className="underline">la liste des sources</a>). Il n&apos;a accès
          à aucun document ARCHE, support de cours privé, donnée personnelle, note ou
          modalité d&apos;évaluation non publique.
        </p>
        <p>
          Si une information n&apos;est pas disponible dans les sources publiques intégrées,
          l&apos;assistant l&apos;indique explicitement plutôt que d&apos;inventer une réponse.
        </p>
        <p>
          Les réponses concernant des modalités précises (coefficients, dates, contacts
          administratifs, cas personnels) doivent toujours être vérifiées auprès des
          sources officielles, d&apos;ARCHE, ou du responsable pédagogique.
        </p>
        <p>
          Si une institution ou un ayant droit souhaite signaler une erreur, demander une
          correction ou le retrait d&apos;une source, contact :{" "}
          <a href="mailto:imrane.larhrib4@etu.univ-lorraine.fr" className="underline">
            imrane.larhrib4@etu.univ-lorraine.fr
          </a>
          .
        </p>
      </div>
    </div>
  );
}
