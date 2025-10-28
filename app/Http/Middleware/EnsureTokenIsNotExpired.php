<?php

namespace App\Http\Middleware;

use App\Models\PersonalAccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsNotExpired
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->user()?->currentAccessToken();

        if ($token?->expires_at?->isPast()) {
            $token->delete();

            return response()->json([
                'message' => 'Token expired'
            ], 401);
        }

        $this->cleanupExpiredTokens();

        return $next($request);
    }

    /**
     * Deletes expired tokens from the database.
     * Runs probabilistically (2% chance) to reduce DB load.
     */
    protected function cleanupExpiredTokens()
    {
        if (random_int(1, 100) <= 2) {
            PersonalAccessToken::whereNotNull('expires_at')
                ->where('expires_at', '<', now())
                ->delete();
        }
    }
}
