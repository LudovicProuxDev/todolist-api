<?php

namespace App\Story;

use App\Factory\TaskFactory;
use Zenstruck\Foundry\Story;

final class DefaultUsersStory extends Story
{
    public function build(): void
    {
        TaskFactory::createMany(100);
    }
}
