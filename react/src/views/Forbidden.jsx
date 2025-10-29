import RouteTitleManager from "../components/RouteTitleManager";

export default function Forbidden({ overrideTitle }) {
  return (
    <>
      {overrideTitle && <RouteTitleManager overrideTitle={overrideTitle} />}
      <main className="grid min-h-full place-items-center bg-gray-100 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-3xl font-semibold text-sky-600">403</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900">
            Forbidden
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            You do not have permission to edit this survey.
          </p>
        </div>
      </main>
    </>
  );
}
